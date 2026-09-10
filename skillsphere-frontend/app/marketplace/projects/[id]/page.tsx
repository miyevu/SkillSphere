'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getProject, Project, updateMilestoneStatus, addMilestone, addProjectMessage,
} from '@/lib/marketplace-data';
import {
  Review, getReviewForProjectByReviewer, getReviewsForProject, addReview, respondToReview,
} from '@/lib/reviews-data';
import StarRatingInput from '@/components/marketplace/StarRatingInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Circle, Send, Plus, DollarSign, Calendar, Star } from 'lucide-react';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [messageText, setMessageText] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [deliverableDrafts, setDeliverableDrafts] = useState<Record<string, string>>({});

  const [projectReviews, setProjectReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    overallRating: 0,
    qualityRating: 0,
    communicationRating: 0,
    timelinessRating: 0,
    professionalismRating: 0,
    comment: '',
  });
  const [responseDraft, setResponseDraft] = useState('');

  const refresh = () => {
    setProject(getProject(params.id as string));
    setProjectReviews(getReviewsForProject(params.id as string));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (project === undefined) return null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h1>
          <Link href="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  if (!user || (user.email !== project.clientEmail && user.email !== project.freelancerEmail)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">You don't have access to this project workspace.</p>
      </div>
    );
  }

  const isFreelancer = user.email === project.freelancerEmail;
  const isClient = user.email === project.clientEmail;
  const otherPartyEmail = isClient ? project.freelancerEmail : project.clientEmail;
  const otherPartyName = isClient ? project.freelancerName : project.clientName;

  const handleMarkDelivered = (milestoneId: string) => {
    const link = deliverableDrafts[milestoneId] || '';
    updateMilestoneStatus(project.id, milestoneId, 'delivered', link);
    refresh();
  };

  const handleApprove = (milestoneId: string) => {
    updateMilestoneStatus(project.id, milestoneId, 'approved');
    refresh();
  };

  const handleAddMilestone = () => {
    if (!milestoneTitle.trim() || !milestoneDate) return;
    addMilestone(project.id, milestoneTitle, milestoneDate);
    setMilestoneTitle('');
    setMilestoneDate('');
    refresh();
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    addProjectMessage(project.id, user.email, user.fullName, messageText);
    setMessageText('');
    refresh();
  };

  const myReview = getReviewForProjectByReviewer(project.id, user.email);
  const reviewOfMe = projectReviews.find((r) => r.revieweeEmail === user.email);

  const handleSubmitReview = () => {
    if (reviewForm.overallRating === 0) return;
    addReview({
      projectId: project.id,
      reviewerEmail: user.email,
      reviewerName: user.fullName,
      revieweeEmail: otherPartyEmail,
      revieweeName: otherPartyName,
      ...reviewForm,
    });
    setReviewForm({
      overallRating: 0,
      qualityRating: 0,
      communicationRating: 0,
      timelinessRating: 0,
      professionalismRating: 0,
      comment: '',
    });
    refresh();
  };

  const handleRespondToReview = () => {
    if (!reviewOfMe || !responseDraft.trim()) return;
    respondToReview(reviewOfMe.id, responseDraft);
    setResponseDraft('');
    refresh();
  };

  const statusColor = project.status === 'completed' ? 'bg-green-100 text-green-800' :
    project.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/marketplace/my" className="text-sm text-slate-600 hover:text-primary">
            ← Back to My Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>{project.status}</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">{project.scope}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 pt-4 border-t">
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />GH₵{project.agreedPrice}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Due {project.deliveryDate}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t text-sm">
            <div><p className="text-slate-500 mb-0.5">Client</p><p className="font-medium text-slate-900">{project.clientName}</p></div>
            <div><p className="text-slate-500 mb-0.5">Freelancer</p><p className="font-medium text-slate-900">{project.freelancerName}</p></div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-bold text-slate-900 mb-4">Milestones</h2>
          <div className="space-y-4">
            {project.milestones.map((m) => (
              <div key={m.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {m.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="font-medium text-slate-900">{m.title}</span>
                  </div>
                  <span className="text-xs text-slate-500">Due {m.dueDate}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2 capitalize">Status: {m.status.replace('_', ' ')}</p>

                {m.deliverableLink && (
                  <a href={m.deliverableLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mb-2">
                    View deliverable
                  </a>
                )}

                {isFreelancer && m.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={deliverableDrafts[m.id] || ''}
                      onChange={(e) => setDeliverableDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder="Link to deliverable"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleMarkDelivered(m.id)}>Mark Delivered</Button>
                  </div>
                )}

                {isClient && m.status === 'delivered' && (
                  <Button size="sm" onClick={() => handleApprove(m.id)} className="gap-2 mt-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isClient && (
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Input value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} placeholder="New milestone title" className="flex-1" />
              <Input type="date" value={milestoneDate} onChange={(e) => setMilestoneDate(e.target.value)} className="w-40" />
              <Button size="sm" variant="outline" onClick={handleAddMilestone} className="gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          )}
        </div>

        {project.status === 'completed' && (
          <div className="bg-white border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-900">Review</h2>
            </div>

            {!myReview ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Rate your experience working with {otherPartyName}.</p>
                <StarRatingInput
                  label="Overall Rating"
                  value={reviewForm.overallRating}
                  onChange={(v) => setReviewForm((prev) => ({ ...prev, overallRating: v }))}
                />
                <StarRatingInput
                  label="Quality"
                  value={reviewForm.qualityRating}
                  onChange={(v) => setReviewForm((prev) => ({ ...prev, qualityRating: v }))}
                />
                <StarRatingInput
                  label="Communication"
                  value={reviewForm.communicationRating}
                  onChange={(v) => setReviewForm((prev) => ({ ...prev, communicationRating: v }))}
                />
                <StarRatingInput
                  label="Timeliness"
                  value={reviewForm.timelinessRating}
                  onChange={(v) => setReviewForm((prev) => ({ ...prev, timelinessRating: v }))}
                />
                <StarRatingInput
                  label="Professionalism"
                  value={reviewForm.professionalismRating}
                  onChange={(v) => setReviewForm((prev) => ({ ...prev, professionalismRating: v }))}
                />
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  placeholder="Write a review..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button onClick={handleSubmitReview} disabled={reviewForm.overallRating === 0}>
                  Submit Review
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Your review of {otherPartyName}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= myReview.overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                {myReview.comment && <p className="text-sm text-slate-700">{myReview.comment}</p>}
              </div>
            )}

            {reviewOfMe && (
              <div className="border rounded-lg p-4 bg-primary/5">
                <p className="text-xs text-slate-500 mb-2">{otherPartyName}'s review of you</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= reviewOfMe.overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                {reviewOfMe.comment && <p className="text-sm text-slate-700 mb-3">{reviewOfMe.comment}</p>}

                {reviewOfMe.response ? (
                  <div className="bg-white border rounded-lg p-3 mt-2">
                    <p className="text-xs text-slate-500 mb-1">Your response</p>
                    <p className="text-sm text-slate-700">{reviewOfMe.response}</p>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={responseDraft}
                      onChange={(e) => setResponseDraft(e.target.value)}
                      placeholder="Respond to this review..."
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleRespondToReview} disabled={!responseDraft.trim()}>
                      Respond
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-bold text-slate-900 mb-4">Messages</h2>
          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
            {project.messages.length === 0 ? (
              <p className="text-sm text-slate-500">No messages yet.</p>
            ) : (
              project.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${msg.senderEmail === user.email ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-900'}`}>
                    <p className="text-xs opacity-70 mb-0.5">{msg.senderName}</p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type a message..." className="flex-1" />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}