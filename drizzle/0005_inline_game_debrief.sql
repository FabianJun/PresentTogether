-- Remove the standalone judgement poll without clearing history or credentials.
-- Move existing completed debrief sessions back to their actual game result.
UPDATE rooms
SET outcome_view = CASE WHEN slide=10 AND json_array_length(history)=4 THEN 'summary' ELSE outcome_view END,
    outcome_round = CASE WHEN slide=10 AND json_array_length(history)=4 THEN -1 ELSE outcome_round END,
    opened = CASE WHEN slide=10 AND json_array_length(history)=4 THEN 0 ELSE opened END,
    revealed = CASE WHEN slide=10 AND json_array_length(history)=4 THEN 1 ELSE revealed END,
    slide = CASE WHEN slide=10 AND json_array_length(history)=4 THEN 9
                 WHEN slide>=11 THEN slide-1 ELSE slide END;
