"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { loginWithGoogle } from "@/lib/auth/google";
import { setGuestMode } from "@/lib/auth/guest";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">)

{
  const router = useRouter();
  const { toast } = useToast();

  async function handleGoogleLogin() {
    const { error } = await loginWithGoogle();
    if (error) {
      toast({
        title: "Login failed",
        variant: "destructive",
      });
    }
  }

  function handleGuestLogin() {
    setGuestMode(true);
    router.push("/admin");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
               
                <Button type="button" className="w-full" onClick={handleGoogleLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or take the tour
                </span>
              </div>
              <div className="grid gap-6">  
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGuestLogin}
>
                  Login as Guest
                </Button>
              </div>
            
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        © {new Date().getFullYear()} TheGreek — View project on <a href="https://github.com/vasilisgee/thegreek" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline hover:text-white transition"> GitHub <FaGithub className="text-base" /></a>         
      </div>
    </div>
  )
}
