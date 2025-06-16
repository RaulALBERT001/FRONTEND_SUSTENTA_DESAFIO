import { Edit, Trash2, Droplets, Zap, Bus, Recycle, Utensils, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Challenge } from "@shared/schema";

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
}

const categoryIcons = {
  AGUA: { icon: Droplets, color: "text-blue-500", bg: "bg-blue-100" },
  ENERGIA: { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-100" },
  TRANSPORTE: { icon: Bus, color: "text-green-500", bg: "bg-green-100" },
  RESIDUOS: { icon: Recycle, color: "text-purple-500", bg: "bg-purple-100" },
  ALIMENTACAO: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-100" },
  CONSUMO: { icon: ShoppingCart, color: "text-pink-500", bg: "bg-pink-100" },
};

const difficultyColors = {
  FACIL: "bg-green-100 text-green-800",
  MEDIO: "bg-yellow-100 text-yellow-800",
  DIFICIL: "bg-red-100 text-red-800",
};

const difficultyLabels = {
  FACIL: "Fácil",
  MEDIO: "Médio",
  DIFICIL: "Difícil",
};

const categoryLabels = {
  AGUA: "Água",
  ENERGIA: "Energia",
  TRANSPORTE: "Transporte",
  RESIDUOS: "Resíduos",
  ALIMENTACAO: "Alimentação",
  CONSUMO: "Consumo",
};

export function ChallengeCard({ challenge, onEdit, onDelete }: ChallengeCardProps) {
  const categoryConfig = categoryIcons[challenge.categoria];
  const CategoryIcon = categoryConfig.icon;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CategoryIcon className={`h-5 w-5 ${categoryConfig.color}`} />
            </div>
            <div className="ml-3">
              <Badge variant="secondary" className={categoryConfig.bg}>
                {categoryLabels[challenge.categoria]}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-primary"
              onClick={() => onEdit(challenge)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500"
              onClick={() => onDelete(challenge)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {challenge.titulo}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2">
            {challenge.descricao}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={difficultyColors[challenge.nivelDificuldade]}>
              {difficultyLabels[challenge.nivelDificuldade]}
            </Badge>
            <span className="text-sm text-gray-500">
              {challenge.tempoEstimado} dias
            </span>
          </div>
          <div className="text-sm font-medium text-primary">
            {challenge.pontuacaoMaxima} pts
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
