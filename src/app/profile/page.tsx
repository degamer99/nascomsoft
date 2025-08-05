// src/app/profile/page.tsx (or wherever your Profile page lives)

// import { Header } from "@/components/header"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const Profile = () => {
  return (
    <>
      {/* <Header /> */}

      <section className="max-w-lg mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        {/* User Info */}
        <Card>
          <CardContent className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/images/avatar.jpg" alt="User avatar" />
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">Moses Hirata</p>
              <p className="text-sm text-muted-foreground">hirata@gmail.com</p>
            </div>
          </CardContent>
        </Card>

        {/* General Section */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Edit Profile</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Notifications</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Wishlist</button>
          </CardContent>
        </Card>

        <Separator />

        {/* Legal Section */}
        <Card>
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Terms of Use</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Privacy Policy</button>
          </CardContent>
        </Card>

        <Separator />

        {/* Personal Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 text-red-600 hover:bg-red-50 rounded">Report a Bug</button>
            <button className="w-full text-left py-2 text-red-600 hover:bg-red-50 rounded">Logout</button>
          </CardContent>
        </Card>
      </section>
    </>
  )
}

export default Profile
