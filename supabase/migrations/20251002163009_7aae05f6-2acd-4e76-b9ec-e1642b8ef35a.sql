-- Add triggers for notifications (table already exists)

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Trigger to create notification when order is created
CREATE OR REPLACE FUNCTION public.notify_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM create_notification(
    NEW.user_id,
    'New Order Created',
    'Your order for ' || NEW.product_name || ' has been created successfully.',
    'success',
    '/dashboard'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_order();

-- Trigger to create notification when order status changes
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_notification(
      NEW.user_id,
      'Order Status Updated',
      'Your order for ' || NEW.product_name || ' status changed to: ' || NEW.status,
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'cancelled' THEN 'error'
        ELSE 'info'
      END,
      '/dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_status_changed ON public.orders;
CREATE TRIGGER on_order_status_changed
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

-- Trigger for document applications
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM create_notification(
    NEW.user_id,
    'Application Submitted',
    'Your ' || NEW.document_type || ' application for ' || NEW.country || ' has been submitted.',
    'success',
    '/dashboard'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_created ON public.document_applications;
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.document_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_application();

-- Trigger for application status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_notification(
      NEW.user_id,
      'Application Status Updated',
      'Your ' || NEW.document_type || ' application status changed to: ' || NEW.status,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        WHEN NEW.status = 'rejected' THEN 'error'
        ELSE 'info'
      END,
      '/dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_status_changed ON public.document_applications;
CREATE TRIGGER on_application_status_changed
  AFTER UPDATE ON public.document_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_application_status_change();