import { OrbitingBorderBadge } from "@/components/orbiting-border-badge"

export default function AnimatedBadge() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-foreground text-4xl font-bold">
          Orbiting Border Badge
        </h1>
        <p className="text-muted-foreground">
          Watch the orb of light travel smoothly along the border
        </p>
        animated
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        {/* Default badge */}
        <OrbitingBorderBadge>Default Badge</OrbitingBorderBadge>

        {/* Custom colors and speeds */}
        <OrbitingBorderBadge orbColor="rgba(236, 72, 153, 0.8)" duration={2}>
          Fast Pink Orb
        </OrbitingBorderBadge>

        {/* Reduced orb size from 10 to 6 for smaller orb */}
        <OrbitingBorderBadge
          orbColor="rgba(34, 197, 94, 0.8)"
          duration={4}
          orbSize={6}
        >
          Slow Green Orb
        </OrbitingBorderBadge>

        <OrbitingBorderBadge
          orbColor="rgba(251, 191, 36, 0.8)"
          duration={2.5}
          borderRadius={20}
        >
          Rounded Badge
        </OrbitingBorderBadge>

        <OrbitingBorderBadge
          orbColor="rgba(139, 92, 246, 0.8)"
          duration={3.5}
          orbSize={12}
          borderRadius={8}
          className="text-lg"
        >
          Large Badge with Big Orb
        </OrbitingBorderBadge>
      </div>
    </main>
  )
}
