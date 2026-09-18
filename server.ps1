$port = 8089
$global:serverFolder = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Server running at http://127.0.0.1:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        [System.Threading.ThreadPool]::QueueUserWorkItem({
            param($ctx)
            try {
                $req = $ctx.Request
                $res = $ctx.Response

                $rawPath = $req.Url.LocalPath.TrimStart('/')
                if ([string]::IsNullOrEmpty($rawPath)) {
                    $rawPath = "index.html"
                }

                $filePath = Join-Path $global:serverFolder $rawPath

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

                    switch ($ext) {
                        ".html" { $res.ContentType = "text/html; charset=utf-8" }
                        ".css"  { $res.ContentType = "text/css; charset=utf-8" }
                        ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
                        ".svg"  { $res.ContentType = "image/svg+xml" }
                        ".png"  { $res.ContentType = "image/png" }
                        ".jpg"  { $res.ContentType = "image/jpeg" }
                        ".mp3"  { $res.ContentType = "audio/mpeg" }
                        Default { $res.ContentType = "application/octet-stream" }
                    }

                    $res.ContentLength64 = $bytes.LongLength
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $res.StatusCode = 404
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $res.ContentLength64 = $errBytes.LongLength
                    $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            } catch {
                # Ignore connection abortions / client resets
            } finally {
                try { $ctx.Response.OutputStream.Close() } catch {}
                try { $ctx.Response.Close() } catch {}
            }
        }, $context) | Out-Null
    }
} finally {
    $listener.Stop()
}
