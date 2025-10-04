import { useEffect } from 'react';
import { toast } from 'sonner';

export const ContentProtection = () => {
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error('Content copying is disabled');
      return false;
    };

    // Prevent keyboard shortcuts for copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        toast.error('Content copying is disabled');
        return false;
      }
      
      // Ctrl+X, Cmd+X (Cut)
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        toast.error('Content copying is disabled');
        return false;
      }
      
      // Ctrl+A, Cmd+A (Select All)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        toast.error('Content selection is disabled');
        return false;
      }
      
      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // F12, Ctrl+Shift+I, Cmd+Option+I (Developer Tools)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C, Cmd+Shift+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag selection
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection in inputs and textareas
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('contenteditable')
      ) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Prevent copy event
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow copy in inputs and textareas
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('contenteditable')
      ) {
        return true;
      }
      e.preventDefault();
      toast.error('Content copying is disabled');
      return false;
    };

    // Prevent cut event
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow cut in inputs and textareas
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('contenteditable')
      ) {
        return true;
      }
      e.preventDefault();
      toast.error('Content copying is disabled');
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
    };
  }, []);

  return null; // This component doesn't render anything
};
