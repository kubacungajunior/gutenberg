type DeterminateProgressBarProps = {
	/**
	 * Value of the progress bar.
	 */
	value: number;

	/**
	 * Maximum progress value.
	 *
	 * @default 100
	 */
	max?: number;

	/**
	 * Mode of the progress bar.
	 *
	 * @default indeterminate
	 */
	mode: 'determinate';
};

type IndeterminateProgressBarProps = {
	/**
	 * Value of the progress bar.
	 */
	value: never;

	/**
	 * Maximum progress value.
	 */
	max?: never;

	/**
	 * Mode of the progress bar.
	 */
	mode: 'indeterminate';
};

export type ProgressBarProps =
	| DeterminateProgressBarProps
	| IndeterminateProgressBarProps;
