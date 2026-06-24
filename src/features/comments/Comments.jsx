import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketComments, addComment, clearComments } from './commentSlice';

const Comments = ({ ticketId }) => {
  const dispatch = useDispatch();
  
  const { items: comments, fetchStatus: commentsStatus, addStatus: commentAddStatus } = useSelector(
    (state) => state.comments
  );

  const [commentMessage, setCommentMessage] = useState('');
  const [commentFile, setCommentFile] = useState(null);

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketComments(ticketId));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, ticketId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;

    const formData = new FormData();
    formData.append('ticketId', ticketId);
    formData.append('message', commentMessage);
    if (commentFile) {
      formData.append('file', commentFile);
    }

    const result = await dispatch(addComment(formData));
    if (addComment.fulfilled.match(result)) {
      setCommentMessage('');
      setCommentFile(null);
      // Reset the file input visually
      const fileInput = document.getElementById('comment-file-input');
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
      
      {/* Comment Form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <textarea
          rows={3}
          value={commentMessage}
          onChange={(e) => setCommentMessage(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-3 flex items-center justify-between">
          <input
            id="comment-file-input"
            type="file"
            onChange={(e) => setCommentFile(e.target.files[0])}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            disabled={commentAddStatus === 'loading' || !commentMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded disabled:opacity-50"
          >
            {commentAddStatus === 'loading' ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {commentsStatus === 'loading' ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4 border-t border-gray-100 mt-4">No comments yet. Start the discussion!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                  {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm text-gray-900">{comment.author?.username || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.message}</p>
                {comment.attachmentUrl && (
                  <div className="mt-3">
                    <a href={comment.attachmentUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
