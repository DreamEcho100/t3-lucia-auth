import { Button } from "~/components/ui/button";

/**
 * @param {{
 * 	countdown: import("../../hooks/common/countdown").UseCountdownReturn
 * 	isLoading: boolean
 * 	handleSend: () => Promise<void>
 * }} props
 */
export default function ResendVerificationEmailButton(props) {
  return (
    <Button
      disabled={props.countdown.isRunning || props.isLoading}
      onClick={props.handleSend}
      variant={"link"}
    >
      Send verification email{" "}
      {props.countdown.isRunning &&
        !props.isLoading &&
        `in ${props.countdown.count}s`}
    </Button>
  );
}
