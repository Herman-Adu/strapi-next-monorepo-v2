import { ThemeSwitcher } from "@/components/theme-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

export default function ThemeTestPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-foreground text-4xl font-bold">
          Adu Dev Theme Test Page
        </h1>
        <p className="text-muted-foreground text-lg">
          Testing the Adu Dev brand theme across all components
        </p>
      </div>

      {/* Theme Switcher - NEW */}
      <ThemeSwitcher />

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Color Palette</CardTitle>
          <CardDescription>
            Adu Dev orange theme with dark gray accents
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="bg-primary h-24 rounded-lg shadow-md"></div>
            <p className="text-foreground mt-2 text-sm font-medium">Primary</p>
            <p className="text-muted-foreground text-xs">#FF8C00</p>
          </div>
          <div>
            <div className="bg-secondary h-24 rounded-lg shadow-md"></div>
            <p className="text-foreground mt-2 text-sm font-medium">
              Secondary
            </p>
            <p className="text-muted-foreground text-xs">#F5F5F5</p>
          </div>
          <div>
            <div className="bg-accent h-24 rounded-lg shadow-md"></div>
            <p className="text-foreground mt-2 text-sm font-medium">Accent</p>
            <p className="text-muted-foreground text-xs">#FFF4E6</p>
          </div>
          <div>
            <div className="bg-muted h-24 rounded-lg shadow-md"></div>
            <p className="text-foreground mt-2 text-sm font-medium">Muted</p>
            <p className="text-muted-foreground text-xs">#F5F5F5</p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            All button styles with Adu Dev theme
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>
            Inputs, textareas, and form controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              defaultValue="Herman Adu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              defaultValue="herman@adudev.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={4}
              defaultValue="Testing the Adu Dev theme with form elements!"
            />
          </div>
          <div className="flex gap-2">
            <Button>Submit Form</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Labels</CardTitle>
          <CardDescription>Badge variations and states</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="bg-primary text-primary-foreground">
            Custom Primary
          </Badge>
          <Badge className="bg-accent text-accent-foreground">
            Custom Accent
          </Badge>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Text styles and colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              Heading 2 - Foreground
            </h2>
            <h3 className="text-foreground text-xl font-semibold">
              Heading 3 - Foreground
            </h3>
            <h4 className="text-muted-foreground text-lg font-medium">
              Heading 4 - Muted Foreground
            </h4>
          </div>
          <div className="space-y-2">
            <p className="text-foreground">
              Default text using foreground color. This is the primary text
              color throughout the application.
            </p>
            <p className="text-muted-foreground">
              Muted text for less important information or secondary content.
            </p>
            <p className="text-primary font-semibold">
              Primary colored text - Adu Dev orange (#FF8C00)
            </p>
            <p className="text-destructive">
              Destructive text for errors or warnings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Feature Card 1</CardTitle>
            <CardDescription>Card with primary action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This card demonstrates the Adu Dev theme with a primary button.
            </p>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Card 2</CardTitle>
            <CardDescription>Card with secondary action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Secondary variant showing alternative styling options.
            </p>
            <Button variant="secondary" className="w-full">
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Card 3</CardTitle>
            <CardDescription>Card with outline action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Outline style for subtle call-to-action buttons.
            </p>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Table with Adu Dev theme styling</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Website Redesign</TableCell>
                <TableCell>
                  <Badge>In Progress</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell className="text-right">75%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mobile App</TableCell>
                <TableCell>
                  <Badge variant="secondary">Planning</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Medium</Badge>
                </TableCell>
                <TableCell className="text-right">20%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">API Integration</TableCell>
                <TableCell>
                  <Badge className="bg-primary text-primary-foreground">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell className="text-right">90%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Projects</CardDescription>
            <CardTitle className="text-primary text-4xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Clients</CardDescription>
            <CardTitle className="text-primary text-4xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-primary text-4xl">94%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">+2% increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-primary text-4xl">$45K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-primary-foreground text-3xl">
            Ready to Get Started with Adu Dev?
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Experience the power of custom theme development
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="text-primary bg-white hover:bg-white/90"
          >
            Contact Us
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
