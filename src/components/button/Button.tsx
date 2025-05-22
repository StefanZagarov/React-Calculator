import styles from './Button.module.css';

interface ButtonProps {
    value: string;
    onClick: (value: string) => void;
    variant?: "default" | "function";
}

export default function Button({ value, onClick, variant = "default" }: ButtonProps) {
    const buttonVariants = {
        default: styles["btn"],
        function: styles["fn-btn"],
    };

    const className = buttonVariants[variant];

    return (
        <button className={className} onClick={() => onClick(value)}>
            {value}
        </button >
    );
}