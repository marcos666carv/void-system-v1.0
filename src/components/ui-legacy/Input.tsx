
"use client";

import { type ComponentType, type HTMLAttributes, type ReactNode, type Ref, createContext, useContext } from "react";
import { HelpCircle, AlertCircle } from "lucide-react";
import type { InputProps as AriaInputProps, TextFieldProps as AriaTextFieldProps, LabelProps as AriaLabelProps, TextProps as AriaTextProps } from "react-aria-components";
import { Group as AriaGroup, Input as AriaInput, TextField as AriaTextField, Label as AriaLabel, Text as AriaText } from "react-aria-components";
import { cn } from "@/lib/utils/cn";
import { Tooltip } from "@/components/ui/Tooltip";

// --- HintText ---
interface HintTextProps extends AriaTextProps {
    isInvalid?: boolean;
    ref?: Ref<HTMLElement>;
    children: ReactNode;
}

export const HintText = ({ isInvalid, className, ...props }: HintTextProps) => {
    return (
        <AriaText
            {...props}
            slot={isInvalid ? "errorMessage" : "description"}
            className={cn(
                "text-sm text-void-slate mt-1.5",
                isInvalid && "text-void-error",
                "group-invalid:text-void-error",
                className
            )}
        />
    );
};

// --- Label ---
interface LabelProps extends AriaLabelProps {
    children: ReactNode;
    isRequired?: boolean;
    tooltip?: string;
    ref?: Ref<HTMLLabelElement>;
}

export const Label = ({ isRequired, tooltip, className, ...props }: LabelProps) => {
    return (
        <AriaLabel
            {...props}
            className={cn("flex cursor-default items-center gap-0.5 text-sm font-medium text-void-deep-blue mb-1.5", className)}
        >
            {props.children}
            {isRequired && <span className="text-void-vibrant-blue">*</span>}
            {tooltip && (
                <Tooltip title={tooltip}>
                    <div className="cursor-pointer text-void-slate transition hover:text-void-deep-blue ml-1">
                        <HelpCircle className="size-4" />
                    </div>
                </Tooltip>
            )}
        </AriaLabel>
    );
};

// --- Input ---
// InputBase renders the actual <input> element and its wrapper (Group).
// It should accept AriaInputProps (which are HTML attributes) + our styling props.
export interface InputBaseProps extends Omit<AriaInputProps, 'size'> {
    tooltip?: string;
    size?: "sm" | "md";
    placeholder?: string;
    iconClassName?: string;
    inputClassName?: string;
    wrapperClassName?: string;
    shortcut?: string | boolean;
    ref?: Ref<HTMLInputElement>;
    groupRef?: Ref<HTMLDivElement>;
    icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
}

interface TextFieldCtx {
    size?: "sm" | "md";
    wrapperClassName?: string;
    inputClassName?: string;
    iconClassName?: string;
    tooltipClassName?: string;
}

const TextFieldContext = createContext<TextFieldCtx>({});

export const InputBase = ({
    ref,
    tooltip,
    shortcut,
    groupRef,
    size = "sm",
    isInvalid,
    isDisabled,
    icon: Icon,
    placeholder,
    wrapperClassName,
    inputClassName,
    iconClassName,
    isLoading,
    ...inputProps
}: InputBaseProps) => {

    const context = useContext(TextFieldContext);
    const inputSize = context?.size || size;

    const sizes = {
        sm: {
            root: cn("px-3 py-2", (tooltip || isInvalid) && "pr-9", Icon && "pl-10"),
            iconLeading: "left-3",
            iconTrailing: "right-3",
            shortcut: "pr-2.5",
        },
        md: {
            root: cn("px-3.5 py-2.5", (tooltip || isInvalid) && "pr-9.5", Icon && "pl-10.5"),
            iconLeading: "left-3.5",
            iconTrailing: "right-3.5",
            shortcut: "pr-3",
        },
    };

    return (
        <AriaGroup
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            ref={groupRef}
            className={({ isFocusWithin, isDisabled, isInvalid }) =>
                cn(
                    "relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-white shadow-sm ring-1 ring-border transition-all duration-200 ease-in-out",
                    isFocusWithin && !isDisabled && "ring-2 ring-primary border-primary",
                    isDisabled && "cursor-not-allowed bg-void-ice opacity-60",
                    isInvalid && "ring-void-error border-void-error",
                    context?.wrapperClassName,
                    wrapperClassName,
                )
            }
        >
            {Icon && (
                <Icon
                    className={cn(
                        "pointer-events-none absolute size-5 text-void-slate",
                        isDisabled && "text-void-slate/50",
                        sizes[inputSize].iconLeading,
                        iconClassName
                    )}
                />
            )}

            <AriaInput
                {...inputProps}
                ref={ref}
                placeholder={placeholder}
                className={cn(
                    "m-0 w-full bg-transparent text-base text-void-deep-blue focus:outline-hidden placeholder:text-void-slate/50",
                    isDisabled && "cursor-not-allowed text-void-slate",
                    sizes[inputSize].root,
                    inputClassName
                )}
            />

            {tooltip && !isInvalid && (
                <Tooltip title={tooltip}>
                    <div className={cn(
                        "absolute cursor-pointer text-void-slate transition hover:text-void-deep-blue",
                        sizes[inputSize].iconTrailing
                    )}>
                        <HelpCircle className="size-4" />
                    </div>
                </Tooltip>
            )}

            {isInvalid && (
                <AlertCircle
                    className={cn(
                        "pointer-events-none absolute size-4 text-void-error",
                        sizes[inputSize].iconTrailing
                    )}
                />
            )}
        </AriaGroup>
    );
};

// InputProps extends TextFieldProps because Input component renders AriaTextField.
// We also want to expose styling props from InputBaseProps.
export interface InputProps extends AriaTextFieldProps {
    label?: string;
    hint?: ReactNode;
    hideRequiredIndicator?: boolean;
    tooltip?: string;
    size?: "sm" | "md";
    placeholder?: string;
    icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    iconClassName?: string;
    inputClassName?: string;
    wrapperClassName?: string;
    shortcut?: string | boolean;
    groupRef?: Ref<HTMLDivElement>;
    ref?: Ref<HTMLInputElement>;
}

export const Input = ({
    size = "sm",
    placeholder,
    icon: Icon,
    label,
    hint,
    shortcut,
    hideRequiredIndicator,
    className,
    ref,
    groupRef,
    tooltip,
    iconClassName,
    inputClassName,
    wrapperClassName,
    ...props
}: InputProps) => {
    return (
        <AriaTextField aria-label={!label ? placeholder : undefined} {...props} className={cn("group flex w-full flex-col gap-1.5", className)}>
            {({ isRequired, isInvalid, isDisabled }) => (
                <>
                    {label && <Label isRequired={hideRequiredIndicator ? !hideRequiredIndicator : isRequired} tooltip={tooltip}>{label}</Label>}

                    <InputBase
                        ref={ref}
                        groupRef={groupRef}
                        size={size}
                        placeholder={placeholder}
                        icon={Icon}
                        shortcut={shortcut}
                        iconClassName={iconClassName}
                        inputClassName={inputClassName}
                        wrapperClassName={wrapperClassName}
                        tooltip={tooltip}
                        // Important: Pass state derived from TextField to InputBase
                        isInvalid={isInvalid}
                        isDisabled={isDisabled}
                    // Do NOT pass props that overlap improperly like onChange
                    />

                    {hint && <HintText isInvalid={isInvalid}>{hint}</HintText>}
                </>
            )}
        </AriaTextField>
    );
};
