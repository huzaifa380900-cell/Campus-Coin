import { Inbox } from 'lucide-react';
export function EmptyState({ title = 'Nothing here yet', children }) { return <div className="empty"><Inbox size={28}/><strong>{title}</strong><span>{children}</span></div>; }
