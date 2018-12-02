namespace YouthSoccerLineup.Model
{
    public class Position
    {
        public string Name { get; set; }
        public Player StartingPlayer { get; set; }
        public Position(string name)
        {
            this.Name = name;
        }
    }
}