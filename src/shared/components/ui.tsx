/**
 * Shared UI Components using DaisyUI 5 patterns
 * Reusable components for the bakery app
 */

import React from 'react';

// ============================================================================
// CARD COMPONENT
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  headerAction 
}) => (
  <div className={`card bg-base-100 shadow-sm border border-base-300 ${className}`}>
    {(title || headerAction) && (
      <div className="card-body px-6 py-4 border-b border-base-300 flex items-center justify-between">
        <div>
          {title && <h3 className="card-title text-base-content font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-base-content/60 mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
    )}
    <div className="card-body p-6">{children}</div>
  </div>
);

// ============================================================================
// STAT COMPONENT (for dough profile)
// ============================================================================

interface StatProps {
  label: string;
  value: number | string;
  max?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  unit?: string;
}

export const Stat: React.FC<StatProps> = ({ 
  label, 
  value, 
  max = 5, 
  color = 'primary', 
  icon, 
  unit 
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
  const percentage = max > 0 ? (numericValue / max) * 100 : 0;
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
  };
  
  const barColor = colorClasses[color];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-base-content">
          {icon && <span className="text-base-content/60">{icon}</span>}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-base-content/70 font-mono">
          {typeof value === 'number' ? value.toFixed(1) : value}
          {unit && <span className="text-xs font-normal ml-1">{unit}</span>}
          {max && <span className="text-xs text-base-content/40 ml-1">/ {max}</span>}
        </span>
      </div>
      <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// SCORE BAR (legacy compatibility)
// ============================================================================

interface ScoreBarProps {
  label: string;
  score: number;
  colorClass?: string;
  max?: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ 
  label, 
  score, 
  colorClass = 'bg-primary', 
  max = 5 
}) => {
  const percentage = max > 0 ? (score / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-base-content/70">
        <span>{label}</span>
        <span>{score.toFixed(1)} / {max}</span>
      </div>
      <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'dash' | 'soft' | 'ghost';
  color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'soft', 
  color = 'primary', 
  size = 'md', 
  className = '' 
}) => (
  <span className={`badge badge-${variant} badge-${color} badge-${size} ${className}`}>
    {children}
  </span>
);

// ============================================================================
// ALERT COMPONENT
// ============================================================================

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  style?: 'outline' | 'dash' | 'soft';
  direction?: 'horizontal' | 'vertical';
  className?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'info', 
  style = 'soft', 
  direction = 'horizontal',
  className = '',
  onDismiss 
}) => (
  <div 
    role="alert" 
    className={`alert alert-${style} alert-${variant} alert-${direction} ${className}`}
  >
    <div>{children}</div>
    {onDismiss && (
      <button className="btn btn-sm btn-ghost" onClick={onDismiss}>
        ✕
      </button>
    )}
  </div>
);

// ============================================================================
// INPUT COMPONENT
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  icon, 
  iconPosition = 'left',
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-base-content">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`input input-bordered w-full ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${
            error ? 'border-error focus:border-error focus:ring-error' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-base-content/50">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// SELECT COMPONENT
// ============================================================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  helperText, 
  options, 
  placeholder,
  className = '',
  id,
  ...props 
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-base-content">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`select select-bordered w-full ${
          error ? 'border-error focus:border-error focus:ring-error' : ''
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-base-content/50">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// TOGGLE/SWITCH COMPONENT
// ============================================================================

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ 
  label, 
  description, 
  className = '',
  id,
  ...props 
}) => {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="flex items-start gap-3">
      <input
        id={toggleId}
        type="checkbox"
        className="toggle toggle-primary"
        {...props}
      />
      {(label || description) && (
        <div className="pt-1">
          {label && (
            <label htmlFor={toggleId} className="cursor-pointer font-medium text-base-content">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-base-content/50 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ children, className = '' }) => (
  <div className={`divider ${className}`}>
    {children}
  </div>
);

// ============================================================================
// LOADING COMPONENT
// ============================================================================

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  style = 'spinner', 
  className = '' 
}) => (
  <span className={`loading loading-${style} loading-${size} ${className}`} />
);

// ============================================================================
// COLLAPSE/ACCORDION COMPONENT
// ============================================================================

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onChange?: (open: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const Collapse: React.FC<CollapseProps> = ({ 
  title, 
  children, 
  open = false, 
  onChange, 
  icon,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(open);
  
  const handleToggle = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onChange?.(newOpen);
  };
  
  return (
    <div className={`collapse collapse-arrow ${className}`} tabIndex={0}>
      <input 
        type="radio" 
        name={title} 
        checked={isOpen} 
        onChange={handleToggle}
        className="peer hidden"
        id={`collapse-${title.replace(/\s+/g, '-')}`}
      />
      <div className="collapse-title flex items-center gap-3 font-medium text-base-content">
        {icon && <span className="text-base-content/60">{icon}</span>}
        <span>{title}</span>
        <span className="ml-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      <div className="collapse-content pt-2 text-base-content/80">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const positionClasses = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-start',
    right: 'tooltip-end',
  };
  
  return (
    <div className={`tooltip ${positionClasses[position]} inline-block`} tabIndex={0}>
      <div className="cursor-help">{children}</div>
      <div className="tooltip-content">{content}</div>
    </div>
  );
};

// ============================================================================
// TABLE COMPONENT
// ============================================================================

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export function Table<T>({ 
  columns, 
  data, 
  className = '', 
  emptyMessage = 'No data available',
  keyExtractor 
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/50">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={keyExtractor(item)}>
              {columns.map(col => (
                <td key={col.key} className={col.className}>
                  {col.render ? col.render(item, index) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// THEME TOGGLE COMPONENT
// ============================================================================

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = React.useState<'bakery' | 'bakery-dark'>(() => {
    if (typeof window !== 'undefined') {
      return (document.documentElement.getAttribute('data-theme') as 'bakery' | 'bakery-dark') || 'bakery';
    }
    return 'bakery';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'bakery' ? 'bakery-dark' : 'bakery';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'bakery' | 'bakery-dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('bakery-dark');
      document.documentElement.setAttribute('data-theme', 'bakery-dark');
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-sm gap-2 ${className}`}
      aria-label={theme === 'bakery' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={theme === 'bakery-dark'}
    >
      {theme === 'bakery' ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
};