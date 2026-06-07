import * as React from "react";

/**
 * Surface container — navy fill, hairline ring, 14px radius.
 * @startingPoint section="ResearchOS" subtitle="Card — surfaces, headers, footers" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hover lift + pointer; use for clickable session cards. */
  interactive?: boolean;
  /** Built-in 24px padding. */
  pad?: boolean;
  /** Built-in 16px padding (compact rows). */
  padSm?: boolean;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function CardTitle(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function CardDescription(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function CardContent(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function CardFooter(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
