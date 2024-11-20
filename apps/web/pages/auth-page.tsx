'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { BASE_URL } from '@/next.config';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { useSetRecoilState } from 'recoil'
import { userState } from '@/lib/store/atoms/user'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({ firstName: '', lastName: '', username: '', password: '' })
  const lastNameRef = useRef<HTMLInputElement>(null)
  const router = useRouter();
  const setUser  = useSetRecoilState(userState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authForm.username || !authForm.password || (!isLogin && (!authForm.firstName || !authForm.lastName))) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const endpoint = isLogin ? `${BASE_URL}/api/v1/signin` : `${BASE_URL}/api/v1/signup`
    const payload = isLogin 
      ? { username: authForm.username, password: authForm.password }
      : { username: authForm.username, password: authForm.password, name: authForm.firstName + ' ' + authForm.lastName }

    try {
        const res = await axios.post(endpoint, payload, {
            headers: {
                "Content-type": "application/json"
            }
        });
        const data = res.data;
        localStorage.setItem("token", data.token);
        console.log(data);
        if (data.name) {
            setUser({
                isLoading:false,
                username:data.username,
                name:data.name,
                userId:data.userId
            })

            router.push('/');
            toast({
                title: "Success",
                description: isLogin ? "Logged in successfully!" : "Signed up successfully!",
                className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
            })
        } else {
            throw new Error(isLogin ? 'Login failed' : 'Signup failed')
        }
        setAuthForm({username: '', password: '', firstName: '', lastName: ''})
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: `${isLogin ? 'Login' : 'Signup'} failed. Please try again.${error}`,
        variant: "destructive",
      })
    }
  }

  const handleFirstNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      lastNameRef.current?.focus()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Enter your credentials to login.' : 'Create a new account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => {
            setAuthForm({username: '', password: '', firstName: '', lastName: ''})
            setIsLogin(value === "login")
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <TabsContent value="signup">
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col space-y-1.5 flex-1">
                      <Input 
                        id="firstName" 
                        placeholder="First Name"
                        value={authForm.firstName}
                        onChange={(e) => setAuthForm({...authForm, firstName: e.target.value})}
                        onKeyDown={handleFirstNameInput}
                        required={!isLogin}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 flex-1">
                      <Input 
                        id="lastName" 
                        placeholder="Last Name"
                        ref={lastNameRef}
                        value={authForm.lastName}
                        onChange={(e) => setAuthForm({...authForm, lastName: e.target.value})}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </TabsContent>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="Enter your username"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <Button className="w-full mt-4" type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account yet? " : "Already have an account? "}
            <Button variant="link" className="p-0" onClick={() => {
                            setAuthForm({username: '', password: '', firstName: '', lastName: ''})
                            setIsLogin(!isLogin)
                        }}>
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}