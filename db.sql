create database study;

create table FootballClubs(
  ClubID serial Primary Key,
  Name varchar(255),
  FoundationDate date,
  Country varchar(255),
  Emblem text
);

create table Locations(
  LocationID serial Primary Key,
  ClubID int references FootballClubs(ClubID),
  Name varchar(255),
  Country varchar(255),
  City varchar(255),
  FoundationDate date,
  Capacity int,
  Image text
);

create table BonusTypes(
  BonusID serial Primary Key,
  BonusTypeName varchar(255)
);

create table Contracts(
  ContractID serial Primary Key,
  Salary int,
  BonusTypeID int references BonusTypes(BonusID),
  BonusValue int,
  StartDate date,
  EndDate date
);

create table Footballers(
  FootballerID serial Primary Key,
  ContractID int references Contracts(ContractID),
  SecondName varchar(255),
  FirstName varchar(255),
  BirthDate date,
  Age int,
  Country varchar(255),
  Club int references FootballCLubs(ClubID),
  Agent varchar(255),
  FieldPosition varchar(255),
  GameNumber int
);

create table Matches(
  MatchID serial Primary Key,
  Opponent int references FootballCLubs(ClubID),
  Result varchar(8),
  TotalAttempts varchar(8),
  Location int references Location(LocationID),
  Season varchar(16),
  Tournament varchar(255),
  Date date
);

create table Squads(
  ID serial Primary Key,
  MatchID int references Matches(MatchID),
  FootballerID int references Footballers(FootballerID)
);

create table Achievements(
  ID serial Primary Key,
  Tournament varchar(255),
  TournamentPosition int,
  Season varchar(16),
  BestMatch int references Matches(MatchID)
);

create table Goals(
  ID serial Primary Key,
  MatchID int references Matches(MatchID),
  FootballerID int references Footballers(FootballerID),
  minute varchar(8),
  assistant int references Footballers(FootballerID)
);

create table Cards(
  ID serial Primary Key,
  MatchID int references Matches(MatchID),
  FootballerID int references Footballers(FootballerID),
  type varchar(8),
  minute varchar(8)
);

create or replace function getFootballerAge() returns trigger as
  $$ begin
  update Footballers
    set Age = extract('year' from age(BirthDate))
      where Age is Null;
  return New;
  end $$
  language plpgsql;
  
create trigger insertOrUpdateAge
  after insert on Footballers
  for each row
  execute procedure getFootballerAge();