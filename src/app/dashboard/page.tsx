import Link from "next/link";
import { Whistle, PlusCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const courts = [
  { id: 1, name: "Central Court", status: "In Progress" },
  { id: 2, name: "Court 2", status: "Not Started" },
  { id: 3, name: "Court 3", status: "Finished" },
  { id: 4, name: "Court 4", status: "Not Started" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Judge Dashboard
          </h1>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Match
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courts.map((court) => (
            <Card key={court.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{court.name}</CardTitle>
                <CardDescription>Status: {court.status}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Manage the live score for this court.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/score/${court.id}`}>
                    <Whistle className="mr-2 h-4 w-4" />
                    Manage Game
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
