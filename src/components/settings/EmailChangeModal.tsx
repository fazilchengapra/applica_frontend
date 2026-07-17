import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

const emailChangeSchema = z.object({
  new_email: z.string().email("Please enter a valid email address."),
});

type EmailChangeFormValues = z.infer<typeof emailChangeSchema>;

export default function EmailChangeModal({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<EmailChangeFormValues>({
    resolver: zodResolver(emailChangeSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: EmailChangeFormValues) => {
      const response = await api.post("v1/auth/email/change/request/", data);
      return response.data;
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message = error.response?.data?.detail || "An unexpected error occurred.";
      setError("root", { type: "server", message });
    }
  });

  const onSubmit = (data: EmailChangeFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-modal-backdrop">
      <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl shadow-sm overflow-hidden border border-outline-variant animate-modal-content">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-[24px]">
              mail
            </span>
          </div>
          
          {mutation.isSuccess ? (
            <>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Check your inbox
              </h2>
              <p className="font-body-md text-body-md text-secondary mb-6">
                {mutation.data?.detail || "Verification codes sent to both your current and new email."}
              </p>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Email Change
              </h2>
              <p className="font-body-md text-body-md text-secondary mb-6">
                Enter your new email address to receive a verification token.
              </p>
              
              <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {errors.root && (
                  <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
                    {errors.root.message}
                  </div>
                )}
                
                <div className="text-left">
                  <label className="font-label-caps text-label-caps text-secondary mb-1 block">
                    New Email Address
                  </label>
                  <input
                    {...register("new_email")}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors font-body-md text-body-md bg-surface"
                    placeholder="alex.design@example.com"
                    type="email"
                    disabled={mutation.isPending}
                  />
                  {errors.new_email && (
                    <p className="text-error text-xs mt-1">{errors.new_email.message}</p>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className={`w-full py-3 rounded-lg font-title-sm text-title-sm shadow-sm transition-colors outline-none flex items-center justify-center gap-2 ${
                    mutation.isPending 
                      ? 'bg-primary/80 text-on-primary cursor-wait' 
                      : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container focus:ring-2 focus:ring-primary/50 cursor-pointer'
                  }`}
                >
                  {mutation.isPending && (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  )}
                  {mutation.isPending ? 'Sending...' : 'Verify'}
                </button>
                
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      reset();
                      mutation.reset();
                    }}
                    className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors cursor-pointer"
                  >
                    Clear and try again
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <div className="bg-surface-container-low px-6 py-4 flex justify-end border-t border-outline-variant">
          <button
            onClick={onClose}
            className="font-label-caps text-label-caps text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            {mutation.isSuccess ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
