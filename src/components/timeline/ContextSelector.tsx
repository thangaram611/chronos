import { memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContexts } from '@/hooks/use-db';
import type { Context } from '@/lib/db';

interface ContextSelectorProps {
  /** Currently selected context ID */
  value?: string;
  /** Handler when context changes */
  onChange: (contextId: string | undefined) => void;
  /** Additional class name */
  className?: string;
}

/**
 * ContextSelector component
 * Allows selecting a context (category) for a time block
 */
export const ContextSelector = memo(function ContextSelector({
  value,
  onChange,
  className,
}: ContextSelectorProps) {
  const contexts = useContexts();

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-muted-foreground">
        Context
      </label>

      <div className="flex flex-wrap gap-2">
        {/* None option */}
        <ContextChip
          name="None"
          colorHex="#888888"
          isSelected={!value}
          onClick={() => onChange(undefined)}
        />

        {/* Context options */}
        {contexts?.map((context) => (
          <ContextChip
            key={context.id}
            name={context.name}
            colorHex={context.colorHex}
            isSelected={value === context.id}
            onClick={() => onChange(context.id)}
          />
        ))}
      </div>
    </div>
  );
});

interface ContextChipProps {
  name: string;
  colorHex: string;
  isSelected: boolean;
  onClick: () => void;
}

const ContextChip = memo(function ContextChip({
  name,
  colorHex,
  isSelected,
  onClick,
}: ContextChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'text-sm font-medium transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'bg-card shadow-sm border-2'
          : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
      )}
      style={{
        borderColor: isSelected ? colorHex : undefined,
      }}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {/* Color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: colorHex }}
      />

      {/* Name */}
      <span>{name}</span>

      {/* Check mark */}
      {isSelected && (
        <Check className="w-3.5 h-3.5 ml-0.5" style={{ color: colorHex }} />
      )}
    </button>
  );
});

/**
 * Compact context indicator
 */
export const ContextIndicator = memo(function ContextIndicator({
  context,
  className,
}: {
  context?: Context;
  className?: string;
}) {
  if (!context) return null;

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: context.colorHex }}
      />
      <span className="text-xs text-muted-foreground">{context.name}</span>
    </div>
  );
});

export default ContextSelector;
