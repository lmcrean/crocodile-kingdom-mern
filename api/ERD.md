```mermaid
erDiagram
    Scoreboard {
        string id PK
        string username
        number score
        number timeTaken
        date createdAt
    }
```

## Scoreboard Feature ERD

The Entity-Relationship Diagram above represents the scoreboard feature with the following entity:

### Scoreboard
- **id**: Unique identifier for the scoreboard entry
- **username**: Name or identifier of the player
- **score**: The player's score
- **timeTaken**: Time taken to complete (in seconds)
- **createdAt**: Timestamp when the score was recorded
