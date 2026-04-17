"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"form">
>(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
));
Form.displayName = "Form";

interface FormFieldProps {
  name: string;
  render: ({ field }: { field: {
    value: unknown;
    name: string;
    onChange: (...args: unknown[]) => void;
    onBlur: (...args: unknown[]) => void;
  } }) => React.ReactNode;
}

const FormField = ({ name, render }: FormFieldProps) => {
  return render({ field: { name } as any });
};

interface FormItemProps extends React.ComponentProps<"div"> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
);
FormItem.displayName = "FormItem";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
FormLabel.displayName = "FormLabel";

interface FormControlProps extends React.ComponentProps<"div"> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
);
FormControl.displayName = "FormControl";

interface FormDescriptionProps extends React.ComponentProps<"p"> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
);
FormDescription.displayName = "FormDescription";

interface FormMessageProps extends React.ComponentProps<"p"> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        className={cn("text-[0.8rem] font-medium text-destructive", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};