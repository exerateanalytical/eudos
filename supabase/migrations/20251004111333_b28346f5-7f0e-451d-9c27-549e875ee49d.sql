-- Create trigger to automatically send payment confirmation emails
CREATE TRIGGER trigger_notify_payment_confirmed
  AFTER UPDATE ON public.btc_payments
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid'))
  EXECUTE FUNCTION public.notify_payment_confirmed();