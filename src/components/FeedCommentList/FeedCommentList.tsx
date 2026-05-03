import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useFeedCommentsByFeed } from '@/api/feedComments/getFeedCommentsByFeed';
import { postFeedComment } from '@/api/feedComments/postFeedComment';
import { deleteFeedComment } from '@/api/feedComments/deleteFeedComment';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import { formatDateTime } from '@/utils/formatDate';
import type {
  AdminFeedChildComment,
  AdminFeedComment,
  AdminFeedCommentWriter,
} from '@/types/admin/feedComment';
import type { FeedCommentListProps } from './FeedCommentList.types';
import styles from './FeedCommentList.module.scss';

const MAX_CONTENT_LENGTH = 1000;

interface ReplyTarget {
  parentCommentId: string;
  mentionedUserId?: string;
  mentionedUserName?: string;
}

function Avatar({ writer }: { writer: AdminFeedCommentWriter }) {
  return writer.image ? (
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
  mentionedUser,
}: {
  writer: AdminFeedCommentWriter;
  createdAt: string;
  likeCount: number;
  content: string;
  mentionedUser?: AdminFeedCommentWriter | null;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.metaLine}>
        <span className={styles.writerName}>{writer.name}</span>
        <span className={styles.date}>{formatDateTime(createdAt)}</span>
        <span className={styles.likeCount}>♥ {likeCount.toLocaleString()}</span>
      </div>
      <p className={styles.content}>
        {mentionedUser && <span className={styles.mention}>@{mentionedUser.name}</span>}
        {content}
      </p>
    </div>
  );
}

function CommentForm({
  feedId,
  parentCommentId,
  mentionedUserId,
  mentionedUserName,
  onSuccess,
  onCancel,
  placeholder,
  autoFocus,
}: {
  feedId: string;
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
    mutationFn: postFeedComment,
    onSuccess: () => {
      setContent('');
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments', 'by-feed', feedId] });
      onSuccess?.();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setErrorMsg('피드 또는 부모 댓글을 찾을 수 없습니다.');
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
      feedId,
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
  onDelete,
  isDeleting,
}: {
  comment: AdminFeedChildComment;
  onReplyMention: (writer: AdminFeedCommentWriter) => void;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className={styles.childRow}>
      <Avatar writer={comment.writer} />
      <div className={styles.childMain}>
        <CommentBody
          writer={comment.writer}
          createdAt={comment.createdAt}
          likeCount={comment.likeCount}
          content={comment.content}
          mentionedUser={comment.mentionedUser}
        />
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.replyButton}
            onClick={() => onReplyMention(comment.writer)}
          >
            @답글
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  feedId,
  replyTarget,
  onOpenReply,
  onCloseReply,
  onDelete,
  isDeleting,
}: {
  comment: AdminFeedComment;
  feedId: string;
  replyTarget: ReplyTarget | null;
  onOpenReply: (target: ReplyTarget) => void;
  onCloseReply: () => void;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
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
          />
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.replyButton}
              onClick={() =>
                isReplyOpen ? onCloseReply() : onOpenReply({ parentCommentId: comment.id })
              }
            >
              {isReplyOpen ? '답글 취소' : '답글 달기'}
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
            >
              삭제
            </button>
          </div>
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
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
      {isReplyOpen && replyTarget && (
        <div className={styles.replyFormWrapper}>
          <CommentForm
            feedId={feedId}
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

export function FeedCommentList({ feedId }: FeedCommentListProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFeedCommentsByFeed(feedId);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteFeedComment,
    onSuccess: () => {
      setPendingDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments', 'by-feed', feedId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'feed', feedId] });
    },
    onError: (err) => {
      setPendingDeleteId(null);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        alert('이미 삭제된 댓글입니다.');
        queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments', 'by-feed', feedId] });
        return;
      }
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDelete = (commentId: string) => {
    setPendingDeleteId(commentId);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId);
  };

  const totalCount = data
    ? data.reduce((sum, c) => sum + 1 + c.childComments.length, 0)
    : 0;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>
        {data && <span className={styles.count}>{totalCount.toLocaleString()}개</span>}
      </div>

      <CommentForm feedId={feedId} placeholder="공식계정 명의로 댓글을 작성합니다" />

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          댓글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && data.length === 0 && <div className={styles.state}>아직 댓글이 없습니다.</div>}

      {data && data.length > 0 && (
        <ul className={styles.list}>
          {data.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              feedId={feedId}
              replyTarget={replyTarget}
              onOpenReply={setReplyTarget}
              onCloseReply={() => setReplyTarget(null)}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </ul>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="댓글 삭제"
        message="이 댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isPending={deleteMutation.isPending}
      />
    </section>
  );
}
