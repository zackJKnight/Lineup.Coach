using YouthSoccerLineup.Model;

namespace YouthSoccerLineup {
    public class LineupFiller {

        public LineupFiller()
        {

        }
        public void FillByPlayerPreference(Game theGame) {
            // Get the player's favorite positions randomly
            // Lesson learned: do not iterate the periods; step up to the whole Game
            // Find the first open match from beginning to end of Game
            // Place the player
            // When you run out of open favorites, check the second and so on.
        }
    }
}