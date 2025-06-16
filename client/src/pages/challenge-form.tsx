import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChallengeForm } from "@/components/challenges/ChallengeForm";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { ChallengeRequest, Challenge } from "@shared/schema";

export default function ChallengeFormPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/desafios/editar/:id");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = !!match;
  const challengeId = params?.id ? parseInt(params.id) : null;

  const {
    data: editingChallenge,
    isLoading: isLoadingChallenge,
    error,
  } = useQuery({
    queryKey: ["/api/desafios", challengeId],
    queryFn: () => apiClient.getChallenge(challengeId!),
    enabled: !!challengeId,
  });

  const createMutation = useMutation({
    mutationFn: (data: ChallengeRequest) => apiClient.createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/desafios"] });
      toast({
        title: "Sucesso",
        description: "Desafio criado com sucesso!",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar desafio",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ChallengeRequest) => apiClient.updateChallenge(challengeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/desafios"] });
      queryClient.invalidateQueries({ queryKey: ["/api/desafios", challengeId] });
      toast({
        title: "Sucesso",
        description: "Desafio atualizado com sucesso!",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar desafio",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ChallengeRequest) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setLocation("/dashboard");
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isEditing && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">Erro ao carregar desafio</p>
            <p className="text-sm text-gray-600">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
            <Button className="mt-4" onClick={() => setLocation("/dashboard")}>
              Voltar ao Dashboard
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
          title={isEditing ? "Editar Desafio" : "Novo Desafio"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {isEditing ? "Editar Desafio" : "Novo Desafio"}
                </h2>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <ChallengeForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  editingChallenge={editingChallenge}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
