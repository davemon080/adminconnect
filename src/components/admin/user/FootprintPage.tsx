import { AdminUserCommandCenter } from '../../../types';
import { ActionButton, DangerButton, EmptyState, ListCard, Panel, StatCard, formatDate, formatMoney } from './shared';

export default function FootprintPage({
  selectedUser,
  onApprovePartner,
  onRejectPartner,
  onDeletePost,
  onDeleteComment,
  onDeleteMarketItem,
  onDeleteJob,
  onToggleJobStatus,
}: {
  selectedUser: AdminUserCommandCenter | null;
  onApprovePartner: (id: string) => void;
  onRejectPartner: (id: string) => void;
  onDeletePost: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onDeleteMarketItem: (id: string) => void;
  onDeleteJob: (id: string) => void;
  onToggleJobStatus: (id: string, status: 'open' | 'closed') => void;
}) {
  if (!selectedUser) {
    return <EmptyState body="Select a user to inspect the full activity footprint." />;
  }

  return (
    <div className="space-y-5">
      <Panel title="User footprint" subtitle="A broad summary of what this account has touched across Connect.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Comments" value={selectedUser.metrics.comments} />
          <StatCard label="Jobs" value={selectedUser.metrics.jobs} />
          <StatCard label="Proposals" value={selectedUser.metrics.proposals} />
          <StatCard label="Connections" value={selectedUser.metrics.connections} />
          <StatCard label="Pending requests" value={selectedUser.metrics.pendingRequests} />
          <StatCard label="Company follows" value={selectedUser.metrics.companyFollows} />
          <StatCard label="Seller ratings" value={selectedUser.metrics.sellerRatings} />
          <StatCard label="Market live" value={selectedUser.marketSettings.isRegistered ? 'Unlocked' : 'Locked'} />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Posts and comments" subtitle="Moderate this user’s feed footprint.">
          <div className="space-y-3">
            {selectedUser.posts.length === 0 ? <EmptyState body="No recent posts for this user." /> : null}
            {selectedUser.posts.map((post) => (
              <ListCard
                key={post.id}
                title={post.type === 'job' ? `${post.authorName} posted a job highlight` : post.authorName}
                subtitle={post.content}
                meta={formatDate(post.createdAt)}
                actions={<DangerButton label="Delete post" onClick={() => onDeletePost(post.id)} />}
              />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {selectedUser.comments.length === 0 ? <EmptyState body="No recent comments for this user." /> : null}
            {selectedUser.comments.map((comment) => (
              <ListCard
                key={comment.id}
                title={`Comment on post ${comment.postId}`}
                subtitle={comment.content}
                meta={formatDate(comment.createdAt)}
                actions={<DangerButton label="Delete comment" onClick={() => onDeleteComment(comment.id)} />}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Jobs and listings" subtitle="Control public commercial activity for this account.">
          <div className="space-y-3">
            {selectedUser.jobs.length === 0 ? <EmptyState body="No jobs created by this user." /> : null}
            {selectedUser.jobs.map((job) => (
              <ListCard
                key={job.id}
                title={job.title}
                subtitle={`${job.category} • ${job.status} • ${formatMoney(job.budget, 'USD')}`}
                meta={formatDate(job.createdAt)}
                actions={
                  <>
                    <ActionButton label={job.status === 'open' ? 'Close job' : 'Reopen job'} tone="light" onClick={() => onToggleJobStatus(job.id, job.status === 'open' ? 'closed' : 'open')} />
                    <DangerButton label="Delete" onClick={() => onDeleteJob(job.id)} />
                  </>
                }
              />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {selectedUser.marketItems.length === 0 ? <EmptyState body="No market items created by this user." /> : null}
            {selectedUser.marketItems.map((item) => (
              <ListCard
                key={item.id}
                title={item.title}
                subtitle={`${item.category} • ${item.stockQuantity} in stock • ${formatMoney(item.price, item.priceCurrency as 'USD' | 'NGN' | 'EUR')}`}
                meta={formatDate(item.createdAt)}
                actions={<DangerButton label="Delete listing" onClick={() => onDeleteMarketItem(item.id)} />}
              />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Messages" subtitle="Recent direct-message footprint.">
          <div className="space-y-3">
            {selectedUser.messages.length === 0 ? <EmptyState body="No recent messages." /> : null}
            {selectedUser.messages.map((message) => (
              <ListCard
                key={message.id}
                title={`${message.direction === 'sent' ? 'To' : 'From'} ${message.counterpartyName}`}
                subtitle={message.content}
                meta={formatDate(message.createdAt)}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Connections and requests" subtitle="Relationship graph around this account.">
          <div className="space-y-3">
            {selectedUser.friendRequests.length === 0 ? <EmptyState body="No recent connection requests." /> : null}
            {selectedUser.friendRequests.map((request) => (
              <ListCard
                key={request.id}
                title={`${request.direction === 'outgoing' ? 'To' : 'From'} ${request.otherName}`}
                subtitle={request.status}
                meta={formatDate(request.createdAt)}
              />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {selectedUser.connections.length === 0 ? <EmptyState body="No active connections yet." /> : null}
            {selectedUser.connections.map((connection) => (
              <ListCard key={connection.id} title={connection.otherName} subtitle={connection.otherUid} meta={formatDate(connection.createdAt)} />
            ))}
          </div>
        </Panel>

        <Panel title="Follows and ratings" subtitle="Brand reach and market trust around this account.">
          <div className="space-y-3">
            {selectedUser.companyFollows.length === 0 ? <EmptyState body="No company follow activity yet." /> : null}
            {selectedUser.companyFollows.map((follow) => (
              <ListCard
                key={follow.id}
                title={`${follow.direction === 'followers' ? 'Followed by' : 'Following'} ${follow.companyName}`}
                subtitle={follow.companyUid}
                meta={formatDate(follow.createdAt)}
              />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {selectedUser.sellerRatings.length === 0 ? <EmptyState body="No seller ratings yet." /> : null}
            {selectedUser.sellerRatings.map((rating) => (
              <ListCard
                key={rating.id}
                title={`${rating.rating}/5 ${rating.sellerUid === selectedUser.profile.uid ? 'received from' : 'given to'} ${rating.sellerUid === selectedUser.profile.uid ? rating.userName : rating.sellerName}`}
                subtitle={rating.sellerUid === selectedUser.profile.uid ? `Seller: ${rating.sellerName}` : `Buyer: ${rating.userName}`}
                meta={formatDate(rating.createdAt)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
