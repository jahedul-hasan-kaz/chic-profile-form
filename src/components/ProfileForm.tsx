import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, User, Mail, Phone, Calendar, Users, Loader2, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, lazy, Suspense } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { profileApi } from "@/hooks/api-service";

// Lazy load the Welcome component with better error handling
const Welcome = lazy(() => 
  import("./WelcomePage").then(module => ({ 
    default: module.Welcome 
  })).catch(() => ({
    default: () => <div className="text-white">Failed to load welcome page</div>
  }))
);

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone number must be 10-15 digits only"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => date < new Date(), "Date of birth must be in the past"),
  email: z.string().email("Please enter a valid email address"),
  gender: z.enum(["male", "female", "others"], {
    required_error: "Please select a gender",
  }),
  cardNumber: z.string().min(1, "Card number is required").max(20, "Card number must be 20 characters or less"),
});

export function ProfileForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cardNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const profileData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
        gender: values.gender,
        cardNumber: values.cardNumber,
      };

      const response = await profileApi.createProfile(profileData);

      if (response.isSuccess) {
        toast({
          title: "🎉 Profile Created Successfully!",
          description: `Welcome ${values.name}! Your profile has been created and saved.`,
          duration: 5000,
        });
        
        // Show welcome page after successful submission
        setShowWelcome(true);
      } else {
        // Handle API error response
        console.error('API Error:', response);
        toast({
          title: "❌ Profile Creation Failed",
          description: response.errorMessage || "Something went wrong. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "❌ Network Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show welcome page if profile was successfully created
  if (showWelcome) {
    return (
      <Suspense fallback={
        <div className="min-h-screen form-gradient flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <div className="text-white">Loading welcome page...</div>
          </div>
        </div>
      }>
        <Welcome onBackToForm={() => setShowWelcome(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen form-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto form-shadow hover:form-shadow-hover transition-all duration-500 border-0 backdrop-blur-sm form-black-theme">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/lovable-uploads/yakiya_new_logo.png" 
              alt="Yaki Ya Logo" 
              className="h-16 w-auto object-contain rounded-full"
              loading="lazy"
            />
          </div>
          <h1 className="text-3xl font-header font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Create Your Profile
          </h1>
          <p className="text-gray-300 mt-2">
            Please fill in your information to get started
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <User className="h-4 w-4 text-red-500" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        className="form-input h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <Phone className="h-4 w-4 text-red-500" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number (digits only)"
                        className="form-input h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Card Number Field */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <CreditCard className="h-4 w-4 text-red-500" />
                      Card Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your card number (max 20 characters)"
                        className="form-input h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        disabled={isSubmitting}
                        maxLength={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Date of Birth Field */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4 text-red-500" />
                      Date of Birth
                    </FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={isSubmitting}
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                              !field.value && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick your birth date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false); // Close the popover after selecting
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <Mail className="h-4 w-4 text-red-500" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="form-input h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2 text-white">
                      <Users className="h-4 w-4 text-red-500" />
                      Gender
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select your gender" className="text-gray-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="male" className="text-white hover:bg-gray-700 focus:bg-gray-700">Male</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-gray-700 focus:bg-gray-700">Female</SelectItem>
                        <SelectItem value="others" className="text-white hover:bg-gray-700 focus:bg-gray-700">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}