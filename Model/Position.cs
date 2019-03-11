using System;

namespace YouthSoccerLineup.Model
{
    public class Position
    {
        private Player _startingPlayer;
        public Guid Id { get; private set; }
        public PositionType PositionType { get; private set; }
        public string Name { get; set; }
        public Guid PeriodId { get; set; }
        public Player StartingPlayer { get => _startingPlayer; set => _startingPlayer = value; }

        public Position(string name, Guid periodId, PositionType positionType = PositionType.Starting)
        {
            this.Id = Guid.NewGuid();
            this.Name = name;
            this.PeriodId = periodId;
            this.PositionType = positionType;
        }

        public void SetStartingPlayer(Player startingPlayer)
        {
            this.StartingPlayer = startingPlayer;
            // TODO this next line is making me cringe. Need to research why.
            this.StartingPlayer.StartingPositions.Add(this.Id);
        }
    }
}