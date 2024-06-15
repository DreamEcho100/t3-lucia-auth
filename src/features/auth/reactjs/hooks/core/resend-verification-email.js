import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { resubmitEmailVerificationAction } from "../../../nextjs/server/actions";
import useCountdown from "../common/countdown";

export default function useResendVerificationEmail() {
  const countdown = useCountdown({
    countStart: 60,
    intervalMs: 1000,
    countStop: 0,
    isIncrement: false,
  });
  const [showResendVerificationEmail, setShowResendVerificationEmail] =
    useState(false);

  const [
    isResendVerificationEmailLoading,
    startResendVerificationEmailLoading,
  ] = useTransition();

  /** @param {string} email */
  async function onResendVerificationEmail(email) {
    if (countdown.isRunning || isResendVerificationEmailLoading) {
      return;
    }

    startResendVerificationEmailLoading(async () => {
      const res = await resubmitEmailVerificationAction({
        email,
      });

      if (res.status === "error") {
        toast.error(res.message);
      } else if (res.status === "success") {
        toast(res.message ?? "Signed in successfully");
        countdown.startCountdown();
      }
    });
  }

  const count = countdown.count;
  const resetCountdown = countdown.resetCountdown;
  const stopCountdown = countdown.stopCountdown;
  // Is this necessary?
  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
    }
  }, [count, resetCountdown, stopCountdown]);

  return {
    countdown,
    showResendVerificationEmail,
    setShowResendVerificationEmail,
    isResendVerificationEmailLoading,
    onResendVerificationEmail,
  };
}
