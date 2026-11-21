IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Categories] (
        [CategoryID] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([CategoryID])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Locations] (
        [LocationID] int NOT NULL IDENTITY,
        [Name] nvarchar(150) NOT NULL,
        CONSTRAINT [PK_Locations] PRIMARY KEY ([LocationID])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Users] (
        [UserID] int NOT NULL IDENTITY,
        [Username] nvarchar(50) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [Password] nvarchar(max) NOT NULL,
        [Phone] nvarchar(max) NOT NULL,
        [Role] nvarchar(20) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserID])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Notifications] (
        [NotificationID] int NOT NULL IDENTITY,
        [Message] nvarchar(1000) NOT NULL,
        [IsRead] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [Type] nvarchar(max) NOT NULL,
        [LinkUrl] nvarchar(max) NULL,
        [UserID] int NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([NotificationID]),
        CONSTRAINT [FK_Notifications_Users_UserID] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Reports] (
        [ReportID] int NOT NULL IDENTITY,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(2000) NOT NULL,
        [Type] nvarchar(20) NOT NULL,
        [Status] nvarchar(30) NOT NULL,
        [Date] datetime2 NOT NULL,
        [Photo] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UserID] int NOT NULL,
        [CategoryID] int NOT NULL,
        [LocationID] int NOT NULL,
        CONSTRAINT [PK_Reports] PRIMARY KEY ([ReportID]),
        CONSTRAINT [FK_Reports_Categories_CategoryID] FOREIGN KEY ([CategoryID]) REFERENCES [Categories] ([CategoryID]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Reports_Locations_LocationID] FOREIGN KEY ([LocationID]) REFERENCES [Locations] ([LocationID]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Reports_Users_UserID] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE TABLE [Claims] (
        [ClaimID] int NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [Status] nvarchar(30) NOT NULL,
        [Proof] nvarchar(2000) NOT NULL,
        [Photo] nvarchar(max) NULL,
        [AdminNotes] nvarchar(max) NULL,
        [ProcessedAt] datetime2 NULL,
        [UserID] int NOT NULL,
        [ReportID] int NOT NULL,
        CONSTRAINT [PK_Claims] PRIMARY KEY ([ClaimID]),
        CONSTRAINT [FK_Claims_Reports_ReportID] FOREIGN KEY ([ReportID]) REFERENCES [Reports] ([ReportID]) ON DELETE CASCADE,
        CONSTRAINT [FK_Claims_Users_UserID] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Claims_ReportID] ON [Claims] ([ReportID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Claims_UserID] ON [Claims] ([UserID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Notifications_UserID] ON [Notifications] ([UserID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_CategoryID] ON [Reports] ([CategoryID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_LocationID] ON [Reports] ([LocationID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_UserID] ON [Reports] ([UserID]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261121003006_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261121003006_InitialCreate', N'9.0.2');
END;

COMMIT;
GO

