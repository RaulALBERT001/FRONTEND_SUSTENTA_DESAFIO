import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { challengeSchema, ChallengeRequest, Challenge } from "@shared/schema";

interface ChallengeFormProps {
  onSubmit: (data: ChallengeRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
  editingChallenge?: Challenge | null;
}

const categoryOptions = [
  { value: "AGUA", label: "Água" },
  { value: "ENERGIA", label: "Energia" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "RESIDUOS", label: "Resíduos" },
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "CONSUMO", label: "Consumo" },
];

const difficultyOptions = [
  { value: "FACIL", label: "Fácil" },
  { value: "MEDIO", label: "Médio" },
  { value: "DIFICIL", label: "Difícil" },
];

export function ChallengeForm({ onSubmit, onCancel, isLoading, editingChallenge }: ChallengeFormProps) {
  const form = useForm<ChallengeRequest>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      titulo: editingChallenge?.titulo || "",
      descricao: editingChallenge?.descricao || "",
      categoria: editingChallenge?.categoria || undefined,
      nivelDificuldade: editingChallenge?.nivelDificuldade || undefined,
      pontuacaoMaxima: editingChallenge?.pontuacaoMaxima || 0,
      tempoEstimado: editingChallenge?.tempoEstimado || 0,
    },
  });

  const handleSubmit = (data: ChallengeRequest) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do desafio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o desafio detalhadamente"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivelDificuldade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Dificuldade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pontuacaoMaxima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontuação Máxima</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="1"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tempoEstimado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo Estimado (dias)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="1"
                    placeholder="7"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {editingChallenge ? "Atualizando..." : "Criando..."}
              </>
            ) : (
              editingChallenge ? "Atualizar Desafio" : "Criar Desafio"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
