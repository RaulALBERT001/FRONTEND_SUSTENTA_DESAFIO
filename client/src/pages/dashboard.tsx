import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/challenges/StatsCards";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { DeleteChallengeDialog } from "@/components/challenges/DeleteChallengeDialog";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Challenge } from "@shared/schema";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/desafios"],
    queryFn: () => apiClient.getChallenges(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/desafios"] });
      toast({
        title: "Sucesso",
        description: "Desafio excluído com sucesso!",
      });
      setChallengeToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir desafio",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (challenge: Challenge) => {
    setLocation(`/desafios/editar/${challenge.id}`);
  };

  const handleDelete = (challenge: Challenge) => {
    setChallengeToDelete(challenge);
  };

  const confirmDelete = () => {
    if (challengeToDelete) {
      deleteMutation.mutate(challengeToDelete.id);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">Erro ao carregar dados</p>
            <p className="text-sm text-gray-600">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/desafios"] })}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header
          title="Sustenta Desafios"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Gerencie seus desafios de sustentabilidade
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button onClick={() => setLocation("/desafios/novo")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Desafio
                </Button>
              </div>
            </div>

            {/* Stats */}
            {!isLoading && <StatsCards challenges={challenges} />}

            {/* Challenges Grid */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seus Desafios
              </h3>

              {isLoading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" />
                  <p className="mt-2 text-sm text-gray-500">
                    Carregando desafios...
                  </p>
                </div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-12">
                  <Leaf className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Nenhum desafio encontrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece criando seu primeiro desafio de sustentabilidade.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setLocation("/desafios/novo")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Desafio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteChallengeDialog
        challenge={challengeToDelete}
        open={!!challengeToDelete}
        onOpenChange={(open) => !open && setChallengeToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
