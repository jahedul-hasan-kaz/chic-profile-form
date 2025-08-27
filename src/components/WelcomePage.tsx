import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onBackToForm?: () => void;
}

export function Welcome({ onBackToForm }: WelcomeProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen form-gradient flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl mx-auto form-shadow border-0 backdrop-blur-sm form-black-theme transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <CardContent className="text-center py-16 px-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto opacity-20" />
            </div>
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto relative z-10" />
          </div>
          
          <div className="mb-8">
            <img 
              src="/lovable-uploads/yakiya_new_logo.png" 
              alt="Yaki Ya Logo" 
              className="w-auto h-16 mx-auto mb-4 rounded-full"
            />
            <h1 className="text-4xl font-header font-bold text-white mb-4 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Welcome to Yaki Ya!
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <p className="text-xl text-gray-300">
                Congratulations! Your profile has been created successfully.
              </p>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg bg-green-900/30 border border-green-700/50">
              <p className="text-green-300 font-medium">
                🎉 Your journey with Yaki Ya begins now!
              </p>
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onBackToForm && (
              <Button 
                onClick={onBackToForm} 
                variant="outline"
                className="group px-6 py-3 text-base transition-all duration-300 hover:scale-105 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Create Another Profile
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.href = '/'} 
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-base transition-all duration-300 hover:scale-105 border-0"
            >
              Continue Your Journey
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}