import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { usePostComments } from '@/api/postComments/getPostComments';
import { postPostComment } from '@/api/postComments/postPostComment';
import { formatDateTime } from '@/utils/formatDate';
import type {
  AdminPostChildComment,
  AdminPostComment,
  AdminPostCommentWriter,
} from '@/types/admin/postComment';
import type { PostCommentListProps } from './PostCommentList.types';
import styles from './PostCommentList.module.scss';

const DELETED_NAME = '(삭제된 사용자)';
const MAX_CONTENT_LENGTH = 1000;

interface ReplyTarget {
  parentCommentId: string;
  mentionedUserId?: string;
  mentionedUserName?: string;
}

function Avatar({ writer }: { writer: AdminPostCommentWriter | null }) {
  return writer?.image ? (
    <img className={styles.avatar} src={writer.image} alt="" />
  ) : (
    <div className={styles.avatarEmpty} />
  );
}

function CommentBody({
  writer,
  createdAt,
  likeCount,
  content,
  isDeleted = false,
  mentionedUser,
}: {
  writer: AdminPostCommentWriter | null;
  createdAt: string;
  likeCount: number;
  content: string;
  isDeleted?: boolean;
  mentionedUser?: AdminPostCommentWriter | null;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.metaLine}>
        <span className={styles.writerName}>{writer?.name ?? DELETED_NAME}</span>
        <span className={styles.date}>{formatDateTime(createdAt)}</span>
        {isDeleted && <span className={styles.deletedBadge}>삭제됨</span>}
        <span className={styles.likeCount}>♥ {likeCount.toLocaleString()}</span>
      </div>
      {isDeleted ? (
        <p className={styles.deletedContent}>삭제된 댓글입니다.</p>
      ) : (
        <p className={styles.content}>
          {mentionedUser && (
            <span className={styles.mention}>@{mentionedUser.name}</span>
          )}
          {content}
        </p>
      )}
    </div>
  );
}

function CommentForm({
  postId,
  parentCommentId,
  mentionedUserId,
  mentionedUserName,
  onSuccess,
  onCancel,
  placeholder,
  autoFocus,
}: {
  postId: string;
  parentCommentId?: string;
  mentionedUserId?: string;
  mentionedUserName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: postPostComment,
    onSuccess: () => {
      setContent('');
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'post-comments', postId] });
      onSuccess?.();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setErrorMsg('게시글 또는 부모 댓글을 찾을 수 없습니다.');
          return;
        }
        if (err.response?.status === 500) {
          setErrorMsg('서버 설정 오류 (OFFICIAL_USER_ID). 운영팀에 문의하세요.');
          return;
        }
      }
      setErrorMsg('댓글 등록 중 오류가 발생했습니다.');
    },
  });

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_CONTENT_LENGTH && !mutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!canSubmit) return;
    mutation.mutate({
      postId,
      content: trimmed,
      ...(parentCommentId ? { parentCommentId } : {}),
      ...(mentionedUserId ? { mentionedUserId } : {}),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {mentionedUserName && (
        <div className={styles.mentionPrefix}>@{mentionedUserName} 에게 답글</div>
      )}
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder ?? '댓글을 입력하세요'}
        rows={parentCommentId ? 2 : 3}
        maxLength={MAX_CONTENT_LENGTH}
        disabled={mutation.isPending}
        autoFocus={autoFocus}
      />
      <div className={styles.formFooter}>
        <span className={styles.charCount}>
          {trimmed.length}/{MAX_CONTENT_LENGTH}
        </span>
        <div className={styles.formActions}>
          {onCancel && (
            <button
              type="button"
              className={styles.cancel}
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              취소
            </button>
          )}
          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            {mutation.isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
      {errorMsg && <div className={styles.formError}>{errorMsg}</div>}
    </form>
  );
}

function ChildCommentItem({
  comment,
  onReplyMention,
}: {
  comment: AdminPostChildComment;
  onReplyMention: (writer: AdminPostCommentWriter) => void;
}) {
  const { writer } = comment;
  return (
    <div className={styles.childRow}>
      <Avatar writer={writer} />
      <div className={styles.childMain}>
        <CommentBody
          writer={writer}
          createdAt={comment.createdAt}
          likeCount={comment.likeCount}
          content={comment.content}
          mentionedUser={comment.mentionedUser}
        />
        {writer && (
          <button
            type="button"
            className={styles.replyButton}
            onClick={() => onReplyMention(writer)}
          >
            @답글
          </button>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  replyTarget,
  onOpenReply,
  onCloseReply,
}: {
  comment: AdminPostComment;
  postId: string;
  replyTarget: ReplyTarget | null;
  onOpenReply: (target: ReplyTarget) => void;
  onCloseReply: () => void;
}) {
  const isReplyOpen = replyTarget?.parentCommentId === comment.id;

  return (
    <li className={styles.commentItem}>
      <div className={styles.commentRow}>
        <Avatar writer={comment.writer} />
        <div className={styles.commentMain}>
          <CommentBody
            writer={comment.writer}
            createdAt={comment.createdAt}
            likeCount={comment.likeCount}
            content={comment.content}
            isDeleted={comment.isDeleted}
          />
          <button
            type="button"
            className={styles.replyButton}
            onClick={() =>
              isReplyOpen ? onCloseReply() : onOpenReply({ parentCommentId: comment.id })
            }
          >
            {isReplyOpen ? '답글 취소' : '답글 달기'}
          </button>
        </div>
      </div>
      {comment.childComments.length > 0 && (
        <div className={styles.children}>
          {comment.childComments.map((child) => (
            <ChildCommentItem
              key={child.id}
              comment={child}
              onReplyMention={(writer) =>
                onOpenReply({
                  parentCommentId: comment.id,
                  mentionedUserId: writer.id,
                  mentionedUserName: writer.name,
                })
              }
            />
          ))}
        </div>
      )}
      {isReplyOpen && replyTarget && (
        <div className={styles.replyFormWrapper}>
          <CommentForm
            postId={postId}
            parentCommentId={replyTarget.parentCommentId}
            mentionedUserId={replyTarget.mentionedUserId}
            mentionedUserName={replyTarget.mentionedUserName}
            onSuccess={onCloseReply}
            onCancel={onCloseReply}
            placeholder="답글을 입력하세요"
            autoFocus
          />
        </div>
      )}
    </li>
  );
}

export function PostCommentList({ postId }: PostCommentListProps) {
  const { data, isLoading, isError, error } = usePostComments(postId);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const totalCount = data
    ? data.reduce((sum, c) => sum + 1 + c.childComments.length, 0)
    : 0;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>
        {data && <span className={styles.count}>{totalCount.toLocaleString()}개</span>}
      </div>

      <CommentForm postId={postId} placeholder="공식계정 명의로 댓글을 작성합니다" />

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          댓글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && data.length === 0 && (
        <div className={styles.state}>아직 댓글이 없습니다.</div>
      )}

      {data && data.length > 0 && (
        <ul className={styles.list}>
          {data.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              replyTarget={replyTarget}
              onOpenReply={setReplyTarget}
              onCloseReply={() => setReplyTarget(null)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
