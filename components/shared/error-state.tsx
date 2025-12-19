import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Error State Component
 * Display friendly error messages with optional retry action
 */
export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Mohon maaf, terjadi kesalahan. Silakan coba lagi.',
  action,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {action && (
          <CardContent>
            <Button onClick={action.onClick} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Inline error message
export function InlineError({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}
