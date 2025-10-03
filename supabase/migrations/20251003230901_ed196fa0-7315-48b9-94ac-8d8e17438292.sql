-- FIX 1: Activity Logs - Add INSERT policy for admins to create logs
CREATE POLICY "Admins can create activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- FIX 2: Transactions - Allow admins to update transactions (for refunds/adjustments)
CREATE POLICY "Admins can update transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- FIX 3: Escrow Transactions - Allow admins full management
CREATE POLICY "Admins can update escrow transactions"
ON public.escrow_transactions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- FIX 4: Orders - Allow admins to delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX 5: Applications - Allow admins to delete applications
CREATE POLICY "Admins can delete applications"
ON public.document_applications
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX 6: Contact Inquiries - Allow admins to delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.contact_inquiries
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX 7: Support Tickets - Allow admins to delete tickets
CREATE POLICY "Admins can delete tickets"
ON public.support_tickets
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX 8: Create ticket_replies table for support ticket communication
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_staff_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ticket_replies
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Policies for ticket_replies
CREATE POLICY "Users can view replies to their tickets"
ON public.ticket_replies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_replies.ticket_id
    AND user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'moderator'::app_role)
);

CREATE POLICY "Users can create replies to their tickets"
ON public.ticket_replies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_replies.ticket_id
    AND user_id = auth.uid()
  )
  OR (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Admins can manage all ticket replies"
ON public.ticket_replies
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- FIX 9: Create inquiry_replies table for contact inquiries communication
CREATE TABLE IF NOT EXISTS public.inquiry_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on inquiry_replies
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

-- Policies for inquiry_replies
CREATE POLICY "Admins can manage inquiry replies"
ON public.inquiry_replies
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- FIX 10: Add trigger for ticket_replies updated_at
CREATE TRIGGER update_ticket_replies_updated_at
BEFORE UPDATE ON public.ticket_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- FIX 11: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_replies_inquiry_id ON public.inquiry_replies(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);