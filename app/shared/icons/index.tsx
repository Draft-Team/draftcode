import type { SVGProps } from "react"

export const YoutubeLogo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.13em"
			height="1em"
			viewBox="0 0 576 512"
			{...props}>
			<path
				fill="currentColor"
				d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597c-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821c11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305m-317.51 213.508V175.185l142.739 81.205z"></path>
		</svg>
	)
}

export const TwitchLogo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M2.547 1L1 4.776v15.433h5.5V23h3.093l2.922-2.791h4.47L23 14.462V1zm18.39 12.478L17.5 16.76H12l-2.922 2.791v-2.79h-4.64V2.97h16.499zM17.5 6.747v5.74h-2.063v-5.74zm-5.5 0v5.74H9.938v-5.74z"
				clipRule="evenodd"></path>
		</svg>
	)
}

export const LinkedinLogo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 64 64"
			{...props}>
			<path
				fill="currentColor"
				d="M58.5 1H5.6C3.1 1 1.1 3 1.1 5.5v53c0 2.4 2 4.5 4.5 4.5h52.7c2.5 0 4.5-2 4.5-4.5V5.4C63 3 61 1 58.5 1M19.4 53.7h-9.1V24.2h9.1zm-4.6-33.6c-3 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3s5.3 2.4 5.3 5.3s-2.2 5.3-5.3 5.3m39.1 33.6h-9.1V39.4c0-3.4-.1-7.9-4.8-7.9c-4.8 0-5.5 3.8-5.5 7.6v14.6h-9.1V24.2h8.9v4.1h.1c1.3-2.4 4.2-4.8 8.7-4.8c9.3 0 11 6 11 14.2v16z"></path>
		</svg>
	)
}

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
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"></path>
		</svg>
	)
}
