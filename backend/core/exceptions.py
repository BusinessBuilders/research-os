class ResearchOSError(Exception):
    pass

class VaneError(ResearchOSError):
    pass

class QwenError(ResearchOSError):
    pass

class WikiError(ResearchOSError):
    pass

class SessionNotFoundError(ResearchOSError):
    pass
