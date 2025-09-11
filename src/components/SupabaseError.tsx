import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export const SupabaseError: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                        Supabase Configuration Required
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertDescription>
                            The application requires Supabase configuration to function properly.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <h3 className="font-semibold">To fix this issue:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in your project root</li>
                            <li>Add your Supabase credentials:</li>
                        </ol>

                        <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                            <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
                            <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
                        </div>

                        <p className="text-sm text-gray-600">
                            Get these values from your Supabase project dashboard under Settings → API
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            Refresh Page
                        </Button>
                        <Button
                            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                            variant="default"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Supabase Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
