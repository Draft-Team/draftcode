import type { SVGProps } from "react"

export const SpinnersBarsScale = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}>
			<rect width="2.8" height="12" x="1" y="6" fill="currentColor">
				<animate
					id="svgSpinnersBarsScale0"
					attributeName="y"
					begin="0;svgSpinnersBarsScale1.end-0.1s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="6;1;6"></animate>
				<animate
					attributeName="height"
					begin="0;svgSpinnersBarsScale1.end-0.1s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="12;22;12"></animate>
			</rect>
			<rect width="2.8" height="12" x="5.8" y="6" fill="currentColor">
				<animate
					attributeName="y"
					begin="svgSpinnersBarsScale0.begin+0.1s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="6;1;6"></animate>
				<animate
					attributeName="height"
					begin="svgSpinnersBarsScale0.begin+0.1s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="12;22;12"></animate>
			</rect>
			<rect width="2.8" height="12" x="10.6" y="6" fill="currentColor">
				<animate
					attributeName="y"
					begin="svgSpinnersBarsScale0.begin+0.2s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="6;1;6"></animate>
				<animate
					attributeName="height"
					begin="svgSpinnersBarsScale0.begin+0.2s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="12;22;12"></animate>
			</rect>
			<rect width="2.8" height="12" x="15.4" y="6" fill="currentColor">
				<animate
					attributeName="y"
					begin="svgSpinnersBarsScale0.begin+0.3s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="6;1;6"></animate>
				<animate
					attributeName="height"
					begin="svgSpinnersBarsScale0.begin+0.3s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="12;22;12"></animate>
			</rect>
			<rect width="2.8" height="12" x="20.2" y="6" fill="currentColor">
				<animate
					id="svgSpinnersBarsScale1"
					attributeName="y"
					begin="svgSpinnersBarsScale0.begin+0.4s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="6;1;6"></animate>
				<animate
					attributeName="height"
					begin="svgSpinnersBarsScale0.begin+0.4s"
					calcMode="spline"
					dur="0.6s"
					keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
					values="12;22;12"></animate>
			</rect>
		</svg>
	)
}

export const GoogleLogo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}>
			<path
				fill="currentColor"
				d="M12.183 2.75c-3.683 0-6.902 2.031-8.419 5.088a9.05 9.05 0 0 0 0 8.325c1.517 3.056 4.736 5.087 8.419 5.087c2.54 0 4.72-.827 6.244-2.224c2.484-2.173 3.185-5.599 2.658-8.688a.25.25 0 0 0-.246-.208h-8.656a.25.25 0 0 0-.25.25v3.33c0 .138.112.25.25.25h4.768c-.166.74-.687 1.747-1.685 2.423l-.008.005c-.685.502-1.735.852-3.075.852c-2.936 0-5.275-2.455-5.275-5.33c0-2.783 2.472-5.24 5.275-5.24c1.67 0 2.72.683 3.429 1.29a.25.25 0 0 0 .337-.011l2.578-2.52a.25.25 0 0 0-.011-.368c-1.609-1.388-3.784-2.311-6.333-2.311"></path>
		</svg>
	)
}

export const GithubLogo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}>
			<mask id="lineMdGithubLoop0" width="24" height="24" x="0" y="0">
				<g fill="#fff">
					<ellipse cx="9.5" cy="9" rx="1.5" ry="1"></ellipse>
					<ellipse cx="14.5" cy="9" rx="1.5" ry="1"></ellipse>
				</g>
			</mask>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2">
				<path
					strokeDasharray="32"
					strokeDashoffset="32"
					d="M12 4c1.67 0 2.61 0.4 3 0.5c0.53 -0.43 1.94 -1.5 3.5 -1.5c0.34 1 0.29 2.22 0 3c0.75 1 1 2 1 3.5c0 2.19 -0.48 3.58 -1.5 4.5c-1.02 0.92 -2.11 1.37 -3.5 1.5c0.65 0.54 0.5 1.87 0.5 2.5c0 0.73 0 3 0 3M12 4c-1.67 0 -2.61 0.4 -3 0.5c-0.53 -0.43 -1.94 -1.5 -3.5 -1.5c-0.34 1 -0.29 2.22 0 3c-0.75 1 -1 2 -1 3.5c0 2.19 0.48 3.58 1.5 4.5c1.02 0.92 2.11 1.37 3.5 1.5c-0.65 0.54 -0.5 1.87 -0.5 2.5c0 0.73 0 3 0 3">
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						dur="0.7s"
						values="32;0"></animate>
				</path>
				<path
					strokeDasharray="10"
					strokeDashoffset="10"
					d="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5">
					<animate
						attributeName="d"
						dur="3s"
						repeatCount="indefinite"
						values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"></animate>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.8s"
						dur="0.2s"
						values="10;0"></animate>
				</path>
			</g>
			<rect
				width="8"
				height="4"
				x="8"
				y="11"
				fill="currentColor"
				mask="url(#lineMdGithubLoop0)">
				<animate
					attributeName="y"
					dur="10s"
					keyTimes="0;0.45;0.46;0.54;0.55;1"
					repeatCount="indefinite"
					values="11;11;7;7;11;11"></animate>
			</rect>
		</svg>
	)
}
