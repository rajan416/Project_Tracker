-- SQL script to create the Projects table used by the ProjectTracker API.
-- Run this script against your SQL Server instance if you prefer not to use EF migrations.

CREATE TABLE [dbo].[Projects] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [Owner] NVARCHAR(100) NOT NULL,
    [Status] INT NOT NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NOT NULL
);