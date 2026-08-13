"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/* =========================================================================
   ACORDEÃO

   Assente no @radix-ui/react-accordion, com as keyframes `accordion-down` e
   `accordion-up` que já vivem em globals.css.

   Escrito com componentes de função simples e sem `forwardRef`: no React 19 a
   `ref` chega como prop normal, e `React.ComponentProps<typeof X>` já a
   inclui, por isso o spread abaixo encaminha-a sozinho. `React.ElementRef`
   deixou de existir nesta versão, e não é preciso.
   ========================================================================= */

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-[var(--color-hair)]", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-4 text-left",
          "cursor-pointer text-base font-medium hover:no-underline",
          "text-[var(--color-ink)] transition-colors",
          "hover:text-[var(--color-accent-deep)]",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--color-accent-deep)] transition-transform duration-200 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-[var(--color-ink-2)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
