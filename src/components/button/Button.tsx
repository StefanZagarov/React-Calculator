import styles from './Button.module.css';

interface ButtonProps {
    value: string;
    onClick: (value: string) => void;
    variant?: "default" | "function" | "function-top";
}

export default function Button({ value, onClick, variant = "default" }: ButtonProps) {
    const buttonVariants = {
        default: styles["btn"],
        function: styles["fn-btn"],
        "function-top": styles["fn-btn-top"],
    };

    const className = buttonVariants[variant];

    return (
        <button className={className} onClick={() => onClick(value)}>
            {value}
        </button >
    );
}