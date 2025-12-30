// src/contexts/FormDataContext.tsx
import React, { createContext, useContext, useState } from "react";

interface FormData {
  childAge?: number;
  childGender?: string;
  struggle?: string;
  tone?: string;
  customTone?: string;
}

interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function FormDataProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>({});

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
}
