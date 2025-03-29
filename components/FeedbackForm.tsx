import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { database } from "@/config/firebase";
import { useUser } from "@clerk/nextjs";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export default function FeedbackForm() {
  const [congestionLevel, setCongestionLevel] = useState("low");
  const [accidentReported, setAccidentReported] = useState(false);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        setError("User not authenticated. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const userId = user.id;
      const feedbackRef = ref(database!, `users/${userId}/feedback`);

      await set(feedbackRef, {
        congestionLevel,
        accidentReported,
        comments,
        timestamp: Date.now(),
      });

      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Real-Time Feedback</h2>

        {feedbackSubmitted ? (
          <p className="text-green-600">✅ Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">
                Traffic Congestion Level
              </span>
              <select
                value={congestionLevel}
                onChange={(e) => setCongestionLevel(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={accidentReported}
                onChange={(e) => setAccidentReported(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Report an accident in this area</span>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Additional Comments</span>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any observations..."
                className="w-full"
              />
            </label>

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
