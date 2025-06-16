import { Trophy, Leaf, TrendingUp, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Challenge } from "@shared/schema";

interface StatsCardsProps {
  challenges: Challenge[];
}

export function StatsCards({ challenges }: StatsCardsProps) {
  const stats = {
    total: challenges.length,
    easy: challenges.filter(c => c.nivelDificuldade === "FACIL").length,
    medium: challenges.filter(c => c.nivelDificuldade === "MEDIO").length,
    hard: challenges.filter(c => c.nivelDificuldade === "DIFICIL").length,
  };

  const cardData = [
    {
      title: "Total de Desafios",
      value: stats.total,
      icon: Trophy,
      color: "text-primary",
    },
    {
      title: "Fáceis",
      value: stats.easy,
      icon: Leaf,
      color: "text-green-500",
    },
    {
      title: "Médios",
      value: stats.medium,
      icon: TrendingUp,
      color: "text-yellow-500",
    },
    {
      title: "Difíceis",
      value: stats.hard,
      icon: Flame,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
