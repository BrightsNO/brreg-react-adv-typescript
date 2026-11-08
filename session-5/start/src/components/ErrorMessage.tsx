type Props = {
  /** Hva som gikk galt, forklart for brukeren. */
  message: string;
  /** Vises som en «Prøv igjen»-knapp hvis den er med. */
  onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="message message-error">
      <p>{message}</p>
      {onRetry && (
        <button className="primary" onClick={onRetry}>
          Prøv igjen
        </button>
      )}
    </div>
  );
}
