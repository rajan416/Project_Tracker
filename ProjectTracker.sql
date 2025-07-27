create database ProjectTrackerDb;

CREATE TABLE [dbo].[Projects] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [Owner] NVARCHAR(100) NOT NULL,
    [Status] INT NOT NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NOT NULL
);


select * from  [dbo].[Projects];