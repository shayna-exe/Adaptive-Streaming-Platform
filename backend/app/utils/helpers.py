from datetime import datetime

def get_timestamp(t=None) -> str:
    if t is None:
        return datetime.utcnow().isoformat()
    return datetime.utcfromtimestamp(t).isoformat()

def clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(value, max_val))

def smooth_transition(current: float, target: float, alpha: float = 0.3) -> float:
    return current * (1 - alpha) + target * alpha

def quality_to_score(quality: str) -> int:
    scores = {'360p': 1, '480p': 2, '720p': 3, '1080p': 4}
    return scores.get(quality, 1)

def score_to_quality(score: int) -> str:
    qualities = {1: '360p', 2: '480p', 3: '720p', 4: '1080p'}
    return qualities.get(score, '360p')
